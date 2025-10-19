import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.cucumber.keyword.CucumberBuiltinKeywords as CucumberKW
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.windows.keyword.WindowsBuiltinKeywords as Windows
import internal.GlobalVariable as GlobalVariable

/**
 * TC01: WordPress Login Test
 * Cel: Weryfikacja poprawnego logowania do panelu WordPress
 * Kroki:
 * 1. Otwórz stronę logowania WordPress
 * 2. Wprowadź nazwę użytkownika
 * 3. Wprowadź hasło
 * 4. Kliknij przycisk logowania
 * 5. Zweryfikuj pomyślne zalogowanie
 * 6. Zrób zrzut ekranu
 */

// Krok 1: Otwórz przeglądarkę i przejdź do strony logowania
WebUI.openBrowser('')
WebUI.maximizeWindow()
WebUI.navigateToUrl(GlobalVariable.wp_admin_url)

// Krok 2: Poczekaj na załadowanie strony logowania
WebUI.waitForPageLoad(GlobalVariable.default_timeout)
WebUI.verifyElementPresent(findTestObject('WordPress/LoginPage'), GlobalVariable.default_timeout)

// Krok 3: Wprowadź dane logowania
WebUI.setText(findTestObject('WordPress/LoginPage'), GlobalVariable.wp_username)
WebUI.takeScreenshot(GlobalVariable.screenshot_dir + '/01_login_username_entered.png')

WebUI.setEncryptedText(findTestObject('WordPress/PasswordField'), GlobalVariable.wp_password)
WebUI.takeScreenshot(GlobalVariable.screenshot_dir + '/02_login_password_entered.png')

// Krok 4: Zaznacz "Zapamiętaj mnie" (opcjonalnie)
WebUI.check(findTestObject('WordPress/RememberMe'))

// Krok 5: Kliknij przycisk logowania
WebUI.click(findTestObject('WordPress/LoginSubmit'))
WebUI.takeScreenshot(GlobalVariable.screenshot_dir + '/03_login_button_clicked.png')

// Krok 6: Poczekaj na załadowanie dashboardu
WebUI.waitForPageLoad(GlobalVariable.default_timeout)

// Krok 7: Weryfikacja pomyślnego logowania
WebUI.verifyElementPresent(findTestObject('WordPress/Dashboard'), GlobalVariable.default_timeout)
WebUI.verifyElementPresent(findTestObject('WordPress/AdminBar'), GlobalVariable.default_timeout)
WebUI.verifyElementPresent(findTestObject('WordPress/AdminMenu'), GlobalVariable.default_timeout)

// Krok 8: Zweryfikuj obecność menu MASE
WebUI.verifyElementPresent(findTestObject('MASE/MenuLink'), GlobalVariable.default_timeout)

// Krok 9: Zrzut ekranu po zalogowaniu
WebUI.takeScreenshot(GlobalVariable.screenshot_dir + '/04_login_successful_dashboard.png')

// Krok 10: Zapisz informacje o teście
WebUI.comment('Test logowania zakończony pomyślnie')
WebUI.comment('Użytkownik: ' + GlobalVariable.wp_username)
WebUI.comment('URL: ' + GlobalVariable.wp_admin_url)

// Nie zamykaj przeglądarki - będzie używana w kolejnych testach
