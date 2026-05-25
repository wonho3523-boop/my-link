import { test, expect } from '@playwright/test';

test.describe('링크 추가 다이얼로그 E2E 시나리오 테스트', () => {

  test('모달 열기, 실시간 유효성 검사, 링크 추가 및 Live Preview 반영 테스트', async ({ page }) => {
    // 1. 관리자 페이지 접속
    await page.goto('/admin');
    
    // 페이지 로딩 완료 대기 (첫 번째 h1 요소 검증으로 strict mode 회피)
    const pageTitle = page.locator('h1').first();
    await expect(pageTitle).toHaveText('링크 설정 관리');

    // 2. 새로운 링크 추가 버튼 클릭
    const openModalBtn = page.locator('button:has-text("새로운 링크 추가")');
    await expect(openModalBtn).toBeVisible();
    await openModalBtn.click();

    // 3. 모달 다이얼로그 노출 확인
    const modal = page.locator('h2:has-text("새로운 링크 추가")');
    await expect(modal).toBeVisible();

    // 4. 입력 필드 확인 (getByPlaceholder 사용으로 올바른 셀렉터 확보)
    const titleInput = page.getByPlaceholder('예: 공식 인스타그램, 개인 블로그 등');
    const urlInput = page.getByPlaceholder('https://example.com');
    const submitBtn = page.locator('button:has-text("링크 추가하기")');

    await expect(titleInput).toBeVisible();
    await expect(urlInput).toBeVisible();
    
    // 초기에는 Submit 버튼이 비활성화 상태여야 함 (URL이 https:// 이며 변경되지 않았거나 제목이 비어있음)
    await expect(submitBtn).toBeDisabled();

    // 5. 제목 입력 및 비정상 URL 입력 시 실시간 유효성 검사 및 에러 노출 검증
    await titleInput.fill('E2E 자동화 테스트 링크');
    await urlInput.fill('invalid-url-format'); // 잘못된 URL 형식 입력

    const errorMsg = page.locator('text="URL은 http:// 또는 https://로 시작해야 합니다."');
    await expect(errorMsg).toBeVisible();
    await expect(submitBtn).toBeDisabled();

    // 6. 정상적인 URL 입력 시 유효성 통과 및 Submit 버튼 활성화 검증
    await urlInput.fill('https://github.com/wonho3523');
    await expect(errorMsg).not.toBeVisible();
    await expect(submitBtn).toBeEnabled();

    // 7. 아이콘 프리셋 선택 검증 (예: GitHub 아이콘 프리셋 클릭)
    const githubIconPreset = page.locator('button:has-text("GitHub")');
    await expect(githubIconPreset).toBeVisible();
    await githubIconPreset.click();

    // 8. 링크 추가하기 클릭 및 모달 닫힘 검증
    await submitBtn.click();
    await expect(modal).not.toBeVisible();

    // 9. 리스트 최상단에 해당 링크 데이터가 올바르게 삽입되었는지 검증
    const firstTitleInput = page.locator('input[placeholder="링크 제목"]').first();
    const firstUrlInput = page.locator('input[placeholder="https://"]').first();
    
    await expect(firstTitleInput).toHaveValue('E2E 자동화 테스트 링크');
    await expect(firstUrlInput).toHaveValue('https://github.com/wonho3523');

    // 10. Live Preview (오른쪽 스마트폰 목업) 영역에 실시간 동기화 렌더링 확인
    const previewArea = page.locator('div.w-\\[375px\\]'); // 스마트폰 프레임 영역
    await expect(previewArea).toBeVisible();
    
    const previewLinkText = previewArea.locator('text="E2E 자동화 테스트 링크"');
    await expect(previewLinkText).toBeVisible();
  });
});
