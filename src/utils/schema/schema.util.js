import path from 'path';

/**
 * 스키마 이름을 데이터 파일 이름으로 변환합니다.
 * 예: User -> users.json, Post -> posts.json
 * @param {string} schemaName - 스키마 이름
 * @returns {string} 데이터 파일 이름
 */
export function schemaNameToDataFileName(schemaName) {
    // 첫 글자를 소문자로 변환하고 복수형으로 만들기
    const lowerCaseName = schemaName.charAt(0).toLowerCase() + schemaName.slice(1);

    // 간단한 복수형 변환 (영어 기준)
    let pluralName;
    if (lowerCaseName.endsWith('y')) {
        pluralName = lowerCaseName.slice(0, -1) + 'ies';
    } else if (
        lowerCaseName.endsWith('s') ||
        lowerCaseName.endsWith('sh') ||
        lowerCaseName.endsWith('ch') ||
        lowerCaseName.endsWith('x') ||
        lowerCaseName.endsWith('z')
    ) {
        pluralName = lowerCaseName + 'es';
    } else {
        pluralName = lowerCaseName + 's';
    }

    return `${pluralName}.json`;
}

/**
 * Get the data directory path
 * @returns {string} The absolute path of the data directory
 */
export function getDataDirectoryPath() {
    return path.resolve(process.cwd(), 'data');
}

/**
 * Get the schema directory path
 * @returns {string} The absolute path of the schema directory
 */
export function getDomainsDirectoryPath() {
    return path.resolve(process.cwd(), 'src', 'domains');
}

/**
 * 스키마 이름에 대응하는 데이터 파일의 전체 경로를 가져옵니다.
 * @param {string} schemaName - 스키마 이름
 * @returns {string} 데이터 파일 전체 경로
 */
export function getDataFilePath(schemaName) {
    const dataDir = getDataDirectoryPath();
    const fileName = schemaNameToDataFileName(schemaName);
    return path.join(dataDir, fileName);
}
