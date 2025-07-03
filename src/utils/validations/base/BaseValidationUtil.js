/**
 * 기본 검증 유틸리티 클래스
 * 공통적으로 사용되는 검증 함수들을 제공합니다.
 */
export class BaseValidationUtil {
    /**
     * 값이 비어있지 않은지 확인
     * @param {*} data - 검증할 데이터
     * @returns {boolean} 비어있지 않으면 true
     */
    isNotEmpty = (data) => {
        return !!data;
    };

    /**
     * 값이 문자열인지 확인
     * @param {*} data - 검증할 데이터
     * @returns {boolean} 문자열이면 true
     */
    isString = (data) => {
        return typeof data === 'string';
    };

    /**
     * 정규식 패턴과 일치하는지 확인하는 함수를 반환
     * @param {RegExp} regex - 검증할 정규식
     * @returns {Function} 검증 함수
     */
    isRegexMatch = (regex) => (value) => {
        return regex.test(value);
    };

    /**
     * 문자열 길이가 지정된 범위 내에 있는지 확인하는 함수를 반환
     * @param {number} min - 최소 길이
     * @param {number} max - 최대 길이
     * @returns {Function} 검증 함수
     */
    isLengthBetween = (min, max) => (value) => {
        return value.length >= min && value.length <= max;
    };

    /**
     * 값이 숫자인지 확인
     * @param {*} data - 검증할 데이터
     * @returns {boolean} 숫자면 true
     */
    isNumber = (data) => {
        return typeof data === 'number' && !isNaN(data);
    };

    /**
     * 값이 정수인지 확인
     * @param {*} data - 검증할 데이터
     * @returns {boolean} 정수면 true
     */
    isInteger = (data) => {
        return Number.isInteger(data);
    };

    /**
     * 값이 지정된 범위 내의 숫자인지 확인하는 함수를 반환
     * @param {number} min - 최소값
     * @param {number} max - 최대값
     * @returns {Function} 검증 함수
     */
    isNumberBetween = (min, max) => (value) => {
        return this.isNumber(value) && value >= min && value <= max;
    };

    /**
     * 값이 배열인지 확인
     * @param {*} data - 검증할 데이터
     * @returns {boolean} 배열이면 true
     */
    isArray = (data) => {
        return Array.isArray(data);
    };

    /**
     * 값이 객체인지 확인 (null 제외)
     * @param {*} data - 검증할 데이터
     * @returns {boolean} 객체면 true
     */
    isObject = (data) => {
        return typeof data === 'object' && data !== null && !Array.isArray(data);
    };
}
