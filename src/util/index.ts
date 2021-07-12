/**
* Created by archethic on 2021/07/12
*/

import crypto from "crypto";

export class NaverUtil {
    /**
     * @description 네이버 앱 내부 API의 URL 계산
     * @param time 유닉스 타임스템프 시간
     * @param url 원본 url
     * @param key 암호화 키
     * @returns {String} URL
     */
    static getNaverAppsEncUrl(time:number, url:string, key:string) {
        url = url.substring(0, Math.min(255, url.length));
        return `${(url.includes('?') ? `${url}&` : `${url}?`)}msgpad=${time}&md=${encodeURIComponent(crypto.createHmac('sha1', key).update(`${url}${time}`).digest('base64'))}`;
    }
}