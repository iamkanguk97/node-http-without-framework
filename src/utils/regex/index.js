/**
 * NICKNAME: 영문 소/대문자, 숫자, 한글, 언더바(_) 조합 가능, 2자 이상 10자 이하
 */
const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    NICKNAME: /^[a-zA-Z0-9가-힣_]{2,10}$/
};

export default REGEX;
