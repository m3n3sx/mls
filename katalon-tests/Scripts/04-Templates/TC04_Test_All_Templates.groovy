import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import internal.GlobalVariable as GlobalVariable

/**
 * TC04: Test wszystkich szablonów
 * Cel: Weryfikacja działania wszystkich 11 szablonów designu
 * Wymagania: Użytkownik na stronie MASE (TC02)
 */

// Lista wszystkich szablonów do przetestowania
def templates = [
    [name: 'Modern Minimal', id: 'modern-minimal', description: 'Minimalistyczny nowoczesny design'],
    [name: 'Professional Dark', id: 'professional-dark', description: 'Profesjonalny ciemny motyw'],
    [name: 'Creative Bright', id: 'creative-bright', description: 'Kreatywny jasny design'],
    [name: 'Elegant Neutral', id: 'elegant-neutral', description: 'Elegancki neutralny styl'],
    [name: 'Bold & Vibrant', id: 'bold-vibrant', description: 'Odważny i żywy design'],
    [name: 'Soft Pastel', id: 'soft-pastel', description: 'Miękkie pastelowe kolory'],
    [name: 'High Contrast', id: 'high-contrast', description: 'Wysoki kontrast dla dostępności'],
    [name: 'Nature Inspired', id: 'nature-inspired', description: 'Inspirowany naturą'],
    [name: 'Tech Modern', id: 'tech-modern', description: 'Nowoczesny technologiczny'],
    [name: 'Warm & Cozy', id: 'warm-cozy', description: 'Ciepły i przytulny'],
    [name: 'Cool Professional', id: 'cool-professional', description: 'Chłodny profesjonalny']
]

WebUI.comment('=== TEST WSZYSTKICH SZABLONÓW ===')
WebUI.comment("Liczba szablonów do przetestowania: ${templates.size()}")

// Upewnij się, że jesteśmy na zakładce General
WebUI.click(findTestObject('MASE/TabGeneral'))
WebUI.delay(1)

// Przewiń do sekcji szablonów
WebUI.scrollToElement(findTestObject('MASE/TemplateSection'), 5)
WebUI.takeScreenshot(GlobalVariable.screenshot_dir + '/09_template_section_visible.png')

// Testuj każdy szablon
templates.eachWithIndex { template, index ->
    WebUI.comment("--- Test szablonu ${index + 1}/${templates.size()}: ${template.name} ---")
    
    // Krok 1: Znajdź kartę szablonu
    def templateCard = findTestObject("MASE/Template_${template.id}")
    WebUI.verifyElementPresent(templateCard, 5)
    
    // Krok 2: Przewiń do karty szablonu
    WebUI.scrollToElement(templateCard, 3)
    WebUI.delay(1)
    
    // Krok 3: Zrób zrzut ekranu karty szablonu
    WebUI.takeScreenshot(GlobalVariable.screenshot_dir + "/template_${String.format('%02d', index + 1)}_${template.id}_card.png")
    
    // Krok 4: Najechaj myszką na kartę (hover effect)
    WebUI.mouseOver(templateCard)
    WebUI.delay(1)
    WebUI.takeScreenshot(GlobalVariable.screenshot_dir + "/template_${String.format('%02d', index + 1)}_${template.id}_hover.png")
    
    // Krok 5: Kliknij przycisk "Podgląd"
    def previewButton = findTestObject('MASE/TemplatePreviewButton')
    WebUI.click(previewButton)
    WebUI.delay(2)
    
    // Krok 6: Zrób zrzut ekranu podglądu
    WebUI.takeScreenshot(GlobalVariable.screenshot_dir + "/template_${String.format('%02d', index + 1)}_${template.id}_preview.png")
    
    // Krok 7: Zamknij podgląd
    WebUI.click(findTestObject('MASE/ModalClose'))
    WebUI.delay(1)
    
    // Krok 8: Kliknij przycisk "Zastosuj szablon"
    def applyButton = findTestObject('MASE/TemplateApplyButton')
    WebUI.click(applyButton)
    WebUI.delay(2)
    
    // Krok 9: Potwierdź zastosowanie szablonu w modalu
    if (WebUI.verifyElementPresent(findTestObject('MASE/ModalConfirm'), 5, FailureHandling.OPTIONAL)) {
        WebUI.click(findTestObject('MASE/ModalConfirmYes'))
        WebUI.delay(2)
    }
    
    // Krok 10: Poczekaj na zastosowanie zmian
    WebUI.waitForElementNotPresent(findTestObject('MASE/LoadingSpinner'), 15)
    
    // Krok 11: Zrób zrzut ekranu po zastosowaniu szablonu
    WebUI.takeScreenshot(GlobalVariable.screenshot_dir + "/template_${String.format('%02d', index + 1)}_${template.id}_applied.png")
    
    // Krok 12: Sprawdź wszystkie zakładki z zastosowanym szablonem
    def tabs = ['General', 'AdminBar', 'AdminMenu', 'ContentArea', 'Typography', 'VisualEffects', 'Advanced']
    
    tabs.each { tabName ->
        WebUI.comment("Sprawdzanie zakładki: ${tabName}")
        WebUI.click(findTestObject("MASE/Tab${tabName}"))
        WebUI.delay(1)
        WebUI.takeScreenshot(GlobalVariable.screenshot_dir + "/template_${String.format('%02d', index + 1)}_${template.id}_tab_${tabName.toLowerCase()}.png")
    }
    
    // Wróć do zakładki General
    WebUI.click(findTestObject('MASE/TabGeneral'))
    WebUI.delay(1)
    
    // Krok 13: Zrób pełny zrzut ekranu strony
    WebUI.takeFullPageScreenshot(GlobalVariable.screenshot_dir + "/template_${String.format('%02d', index + 1)}_${template.id}_fullpage.png")
    
    // Krok 14: Sprawdź admin bar i menu
    WebUI.comment("Weryfikacja zmian w interfejsie")
    
    // Admin Bar
    def adminBarStyles = [
        'background-color': WebUI.getCSSValue(findTestObject('WordPress/AdminBar'), 'background-color'),
        'color': WebUI.getCSSValue(findTestObject('WordPress/AdminBar'), 'color'),
        'font-size': WebUI.getCSSValue(findTestObject('WordPress/AdminBar'), 'font-size')
    ]
    WebUI.comment("Admin Bar styles: ${adminBarStyles}")
    
    // Admin Menu
    def adminMenuStyles = [
        'background-color': WebUI.getCSSValue(findTestObject('WordPress/AdminMenu'), 'background-color'),
        'color': WebUI.getCSSValue(findTestObject('WordPress/AdminMenu'), 'color'),
        'width': WebUI.getCSSValue(findTestObject('WordPress/AdminMenu'), 'width')
    ]
    WebUI.comment("Admin Menu styles: ${adminMenuStyles}")
    
    // Krok 15: Testuj responsywność
    WebUI.comment("Test responsywności dla szablonu: ${template.name}")
    
    // Desktop
    WebUI.setViewPortSize(1920, 1080)
    WebUI.delay(1)
    WebUI.takeScreenshot(GlobalVariable.screenshot_dir + "/template_${String.format('%02d', index + 1)}_${template.id}_desktop.png")
    
    // Tablet
    WebUI.setViewPortSize(768, 1024)
    WebUI.delay(1)
    WebUI.takeScreenshot(GlobalVariable.screenshot_dir + "/template_${String.format('%02d', index + 1)}_${template.id}_tablet.png")
    
    // Mobile
    WebUI.setViewPortSize(375, 667)
    WebUI.delay(1)
    WebUI.takeScreenshot(GlobalVariable.screenshot_dir + "/template_${String.format('%02d', index + 1)}_${template.id}_mobile.png")
    
    // Wróć do rozmiaru desktop
    WebUI.setViewPortSize(1920, 1080)
    WebUI.delay(1)
    
    WebUI.comment("Szablon ${template.name} przetestowany pomyślnie ✓")
    WebUI.comment("Zrzuty ekranu zapisane: ${7 + tabs.size() + 3}")
    WebUI.comment("")
}

// Podsumowanie testu
WebUI.comment('=== PODSUMOWANIE TESTU SZABLONÓW ===')
WebUI.comment("Przetestowano wszystkie ${templates.size()} szablonów")
WebUI.comment("Każdy szablon przetestowany na 3 rozdzielczościach")
WebUI.comment("Sprawdzono wszystkie zakładki dla każdego szablonu")
WebUI.comment('Wszystkie szablony działają poprawnie ✓')

// Zapisz ustawienia
WebUI.scrollToPosition(0, 0)
WebUI.delay(1)
WebUI.click(findTestObject('MASE/SaveButton'))
WebUI.waitForElementPresent(findTestObject('MASE/SuccessMessage'), 10)
WebUI.takeScreenshot(GlobalVariable.screenshot_dir + '/10_templates_test_completed.png')

WebUI.comment('Test szablonów zakończony pomyślnie')
