export const ERROR_MESSAGE = Object.freeze({
    /** 일반 에러 */
    BAD_REQUEST: { responseCode: 9001, message: '잘못된 형식의 요청 파라미터입니다.' },
    UNAUTHORIZED: { responseCode: 9002, message: '인증이 필요합니다.' },
    FORBIDDEN: { responseCode: 9003, message: '접근 권한이 없습니다.' },
    NOT_FOUND: { responseCode: 9004, message: '요청한 리소스를 찾을 수 없습니다.' },
    ROUTE_NOT_FOUND: { responseCode: 9005, message: '요청한 경로를 찾을 수 없습니다.' },
    METHOD_NOT_ALLOWED: { responseCode: 9006, message: '요청한 메서드를 허용하지 않습니다.' },
    CONFLICT: { responseCode: 9007, message: '요청한 리소스가 이미 존재합니다.' },
    // INTERNAL_SERVER_ERROR: { responseCode: 9008, message: '서버 내부 오류가 발생했습니다.' }
    UNCATCHED_ERROR: { responseCode: 9010, message: '알 수 없는 에러가 발생했습니다.' }
});
