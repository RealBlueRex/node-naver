'use strict';

import nodeRsa from 'node-rsa';
import { NaverConfig } from "../config";
import axios, { AxiosError, AxiosResponse } from "axios";
import { CafeClient } from "../cafe";
import { v4 } from "uuid";
import { Buffer } from "buffer";
import lzString from "lz-string";

export class NaverClient extends CafeClient {
    /**
     * @see https://gist.github.com/GwonHyeok/641fb3ac40c87ff346500051df9b583a
     * @see https://cafe.naver.com/nameyee/27386
     * @author GwonHyeok, Hibot, Kiri
     * @param email 로그인 id
     * @param password 비밀번호
     */
    constructor(email:string, password:string) {
        super();

        this.#email = email;
        this.#password = password;
    }

    login() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let _keys:string = '';
                axios.get(NaverConfig.get_key_url, { withCredentials: true }).then((response:AxiosResponse) => {
                    _keys = response.data;
                    console.log(_keys);
                }).catch((error:AxiosError) => {
                    console.error(error.message);
                    reject(error);
                });
                
                console.log(_keys)
                const _segmentalizedKeys:string[] = _keys.split(',');
                const _sessionKey:string = _segmentalizedKeys[0];
                const _keyName:string = _segmentalizedKeys[1];
                const _nValue:string = _segmentalizedKeys[2];
                const _eValue:string = _segmentalizedKeys[3];
        
                const _key = new nodeRsa();
                _key.importKey({
                    e: Buffer.from(_eValue, 'hex'),
                    n: Buffer.from(_nValue, 'hex')
                }, 'components-public');
                _key.setOptions({ encryptionScheme: 'pkcs1' });
        
                const _encpw = _key.encrypt(
                    `${this.#getLenChar(_sessionKey)}${_sessionKey}${this.#getLenChar(this.#email)}${this.#email}${this.#getLenChar(this.#password)}${this.#password}`,
                    'hex'
                );
                const _data = {
                    a: `${this.#uuid}-4`,
                    b: `1.3.4`,
                    d: [{
                        i: 'id',
                        b: {
                            a: [
                                `0,${this.#email}`
                            ]
                        },
                        d: this.#email,
                        e: false,
                        f: false
                    }, {
                        i: 'pw',
                        e: true,
                        f: false
                    }],
                    h: '1f',
                    i: {
                        a: 'Mozilla/5.0'
                    }
                };
                const _encData = lzString.compressToEncodedURIComponent(JSON.stringify(_data));
                const _bvsd = {
                    uuid: this.#uuid,
                    encData: _encData
                };
        
                let loginResponse = '';
                axios({
                    method: 'POST',
                    url: NaverConfig.login_url,
                    data: {
                        encpw: _encpw,
                        enctp: 1,
                        svctype: 1,
                        smart_LEVEL: -1,
                        bvsd: JSON.stringify(_bvsd),
                        encnm: _keyName,
                        locale: 'ko_KR',
                        url: 'https://naver.com',
                        nvlong: 'on'
                    },
                    headers: {
                        'User-Agent': 'Mozilla/5.0',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    withCredentials: true
                }).then((response:AxiosResponse) => {
                    loginResponse = response.data;
                }).catch((error:AxiosError) => {
                    console.error(error.message);
                    reject(error);
                })
        
                const _extractLoginFinalizeUrl = /location.replace\("(.*)"\)/g.exec(loginResponse);
                const _finalizeUrl = _extractLoginFinalizeUrl ? _extractLoginFinalizeUrl[1] : null;
        
                if(!_finalizeUrl) throw new Error('Login Failed');
        
                axios({
                    url: _finalizeUrl,
                    method: 'get',
                    withCredentials: true
                }).then((response:AxiosResponse) => {
                    console.info(response.data);
                }).catch((error:AxiosError) => {
                    console.error(error.message);
                    reject(error);
                });
        
                axios({
                    url: 'https://lcs.naver.com/m',
                    method: 'get',
                    withCredentials: true
                }).then((response:AxiosResponse) => {
                    console.info(response.data);
                }).catch((error:AxiosError) => {
                    console.error(error.message);
                    reject(error);
                });
            }, 250);
        })
    }

    logout() {
        axios({
            url: NaverConfig.logout_url,
            method: 'get',
            withCredentials: true
        })
    }

    #getLenChar(value:any) {
        return String.fromCharCode(`${value}`.length);
    }

    #uuid = v4();

    #email:string = '';
    #password:string = '';
}

export interface LoginPacket {
    isSuccess: boolean,
    info: {
        email: string,
        password: string,
        uuid: string
    }
}

export interface LoginError {

}