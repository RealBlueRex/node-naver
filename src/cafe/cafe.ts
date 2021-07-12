/**
* Created by archethic on 2021/07/12
*/

import axios from "axios";
import xml2json from "xml2json";

export class CafeClient {
    constructor() {}

    /**
     * @description 카페의 uri에서 카페 id를 가지고 옵니다.
     * @example
     * let cafeID = getCafeID('cafesupport') //'https://cafe.naver.com/cafesupport'
     * console.log(cafeID) //'12048475'
     * @returns {String} cafeID
     * @param cafeName CafeUrlName
     */
    getCafeID(cafeName: string) {
        
    }
}

export enum KnownTalkType {
    ONETOONE = 1,
    GROUP = 2,
    OPEN = 4,
    TRADE = 7
}

export enum KnownTalkMemberLevel {
    MEMBER = 1,
    STAFF = 888,
    MANAGER = 999
}