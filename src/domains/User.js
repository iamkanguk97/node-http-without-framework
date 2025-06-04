class User {
    /**
     * id: string | 고유ID (UUID) (PK)
     * displayId: string | 표시용 ID (예: D0000001) (UNIQUE)
     * emailAddress: string | 이메일 주소
     * emailDomain: string | 이메일 도메인
     * password: string | 비밀번호
     * nickName: string | 닉네임 (UNIQUE)
     * profileImageUrl: string | 프로필 이미지 URL (NULLABLE)
     * createdAt: Date | 생성일시
     * updatedAt: Date | 수정일시
     * deletedAt: Date | 삭제일시
     *
     * @param {Object} data
     */
    constructor(data) {
        // this.id = data.id;
        // this.displayId = data.displayId;
        // this.emailAddress = data.emailAddress;
        // this.emailDomain = data.emailDomain;
        // this.password = data.password;
        // this.nickName = data.nickName;
        // this.createdAt = data.createdAt;
        // this.updatedAt = data.updatedAt;
        // this.deletedAt = data.deletedAt;

        Object.assign(this, data);
    }
}

export default User;
