#!/usr/bin/env node
'use strict';

import { DisplayIdEntity } from './src/entities/DisplayId.js';
import { displayIdToDecimal, decimalToDisplayId, validateDisplayIdPattern } from './src/utils/display-id.util.js';

async function testDisplayIdSystem() {
    console.log('=== DisplayId 시스템 테스트 ===\n');

    try {
        // 1. 현재 DisplayId 확인
        console.log('1. 현재 DisplayId 확인');
        const currentDisplayId = await DisplayIdEntity.getUserSeqDisplayId();
        console.log(`현재 DisplayId: ${currentDisplayId}`);

        // 2. DisplayId 통계 확인
        console.log('\n2. DisplayId 통계');
        const stats = await DisplayIdEntity.getDisplayIdStats();
        console.log(`현재: ${stats.current}`);
        console.log(`현재 번호: ${stats.currentNumber}`);
        console.log(`최대값: ${stats.maxValue}`);
        console.log(`남은 개수: ${stats.remaining}`);
        console.log(`사용률: ${stats.usagePercentage}`);

        // 3. 16진수 변환 테스트
        console.log('\n3. 16진수 변환 테스트');
        const testCases = ['U0000001', 'U0000009', 'U000000A', 'U000000F', 'U0000010', 'U00000FF', 'U0000FFF'];

        testCases.forEach((displayId) => {
            try {
                const decimal = displayIdToDecimal(displayId);
                const converted = decimalToDisplayId(decimal);
                const isValid = validateDisplayIdPattern(displayId);
                console.log(`${displayId} -> ${decimal} -> ${converted} (유효: ${isValid})`);
            } catch (error) {
                console.log(`${displayId} -> 오류: ${error.message}`);
            }
        });

        // 4. 다음 DisplayId 생성 테스트
        console.log('\n4. 다음 DisplayId 생성 테스트');
        const nextDisplayId = DisplayIdEntity.generateNextDisplayId(currentDisplayId);
        console.log(`${currentDisplayId} -> ${nextDisplayId}`);

        // 5. 특별한 케이스 테스트 (U0000009 -> U000000A)
        console.log('\n5. 특별 케이스 테스트 (U0000009 -> U000000A)');
        const specialCase = DisplayIdEntity.generateNextDisplayId('U0000009');
        console.log(`U0000009 -> ${specialCase}`);

        // 6. 경계값 테스트
        console.log('\n6. 경계값 테스트');
        const boundaryTests = ['U000000F', 'U00000FF', 'U0000FFF'];
        boundaryTests.forEach((displayId) => {
            try {
                const next = DisplayIdEntity.generateNextDisplayId(displayId);
                console.log(`${displayId} -> ${next}`);
            } catch (error) {
                console.log(`${displayId} -> 오류: ${error.message}`);
            }
        });
    } catch (error) {
        console.error('테스트 중 오류 발생:', error.message);
    }
}

// 테스트 실행
testDisplayIdSystem().catch(console.error);
