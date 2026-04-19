import { test, expect } from '@playwright/test';
import { unisatInitScript } from './utils/unisatMock';

test.describe('Bitcoin Multisig Escrow Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Inject the UniSat Wallet Mock before each test
    await page.addInitScript(unisatInitScript);

    // 2. Mock Backend API Endpoints
    
    // Mock Escrow Creation
    await page.route('**/api/escrow/create', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-escrow-uuid-123',
          p2wsh_address: 'tb1q-mock-p2wsh-address',
          redeem_script: '522102-mock-redeem-script-ae',
          amount: 15000000, // 0.15 BTC
          status: 'pending'
        })
      });
    });

    // Mock Escrow Status
    await page.route('**/api/escrow/test-escrow-uuid-123/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          contract_id: 'test-escrow-uuid-123',
          p2wsh_address: 'tb1q-mock-p2wsh-address',
          balance: {
            confirmed_sats: 15000000,
            unconfirmed_sats: 0,
            total_sats: 15000000
          },
          amount_expected: 15000000,
          is_funded: true
        })
      });
    });

    // Mock PSBT Upload
    await page.route('**/api/psbt/test-escrow-uuid-123/upload', async (route) => {
      const postData = route.request().postDataJSON();
      console.log('[TestCapture] PSBT Uploaded:', postData);
      expect(postData.signer_role).toBeDefined();
      expect(postData.psbt_base64).toContain('mock_signed_hex');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Mock Upload Success', id: 'psbt-sig-id' })
      });
    });

    // Mock PSBT Combine
    await page.route('**/api/psbt/test-escrow-uuid-123/combine', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ combined_psbt: 'final-psbt-hex' })
      });
    });
  });

  test('should complete the full escrow setup and signing flow', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // --- SETUP PHASE ---
    await expect(page.locator('h1')).toContainText('Configuración del Contrato');

    // Connect Buyer Wallet
    await page.click('[aria-label="Connect Buyer Wallet"]');
    // Verify input is populated with mock pubkey
    const buyerInput = page.locator('input[placeholder="02… or 03…"]').first();
    await expect(buyerInput).toHaveValue(/02318683/);

    // Connect Seller Wallet
    await page.click('[aria-label="Connect Seller Wallet"]');
    const sellerInput = page.locator('input[placeholder="02… or 03…"]').nth(1);
    await expect(sellerInput).toHaveValue(/02318683/);

    // Fill amount and timelock
    await page.fill('input[type="number"] >> nth=0', '0.15');
    
    // Submit Form
    await page.click('button:has-text("Generar Contrato de Escrow")');

    // --- ESCROW PHASE ---
    // Verify transition to escrow view
    await expect(page.locator('h2')).toContainText('Orden #test-esc');
    await expect(page.locator('text=0.15000000 BTC')).toBeVisible();

    // Verify funding status (from mock status API)
    await expect(page.locator('text=Fondeado (Confirmado)')).toBeVisible();

    // --- SIGNING PHASE ---
    // Click Sign Transaction button
    await page.click('text=Firmar Transacción (PSBT)');

    // Verify Modal appears
    await expect(page.locator('text=Revisar y Firmar PSBT')).toBeVisible();
    await expect(page.locator('text=0.15000000 BTC').nth(1)).toBeVisible();

    // Click "Confirmar y Firmar"
    // This will trigger window.unisat.signPsbt inside the browser
    await page.click('button:has-text("Confirmar y Firmar")');

    // Verify signing indicator
    await expect(page.locator('text=Firmando…')).toBeVisible();

    // Wait for the modal to close or the process to finish
    // Since we mocked the upload to return 200, the signaturesAcquired should increase
    await expect(page.locator('text=Firmas: 1 / 2')).toBeVisible();
  });
});
