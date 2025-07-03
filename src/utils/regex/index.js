'use strict';

/**
 * EMAIL: 평소 이메일 형식
 * NICKNAME: 영문 소/대문자, 숫자, 한글, 언더바(_) 조합 가능, 2자 이상 10자 이하
 * ROUTER_PREFIX: RESTful API 표준에 따라 소문자, 숫자 그리고 하이픈(-) 허용
 */
const REGEX = Object.freeze({
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    NICKNAME: /^[a-zA-Z0-9가-힣_]{2,10}$/,
    ROUTER_PREFIX: /^[a-z0-9\-/]+$/
});

export default REGEX;
