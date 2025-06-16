'use strict';

class UserAuth {
    /**
     * id: string | 고유ID (UUID) (PK)
     * userId: string | 사용자ID (FK)
     * sessionId: string | 세션ID
     * status: string | 상태 (ACTIVE, INACTIVE, EXPIRED, REVOKED)
     * ipAddress: string | IP주소
     * userAgent: string | 사용자 에이전트
     * createdAt: Date | 생성일시
     * expiresAt: Date | 만료일시
     * lastAccessedAt: Date | 마지막 접속일시
     * revokedAt: Date | 취소일시
     *
     * @param {Object} data
     */
    constructor(data) {
        // this.id = data.id;
        // this.userId = data.userId;
        // this.sessionId = data.sessionId;
        // this.status = data.status;
        // this.ipAddress = data.ipAddress;
        // this.userAgent = data.userAgent;
        // this.createdAt = data.createdAt;
        // this.expiresAt = data.expiresAt;
        // this.lastAccessedAt = data.lastAccessedAt;
        // this.revokedAt = data.revokedAt;

        Object.assign(this, data);
    }
}

export default UserAuth;
