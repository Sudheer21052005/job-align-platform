import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Click on the Register button to go to the registration page.
        frame = context.pages[-1]
        # Click on the Register button to navigate to the registration page.
        elem = frame.locator('xpath=html/body/div/div/div/div/div/div[2]/div/a[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Fill in the registration form with valid user details and select the Job Seeker role.
        frame = context.pages[-1]
        # Enter full name
        elem = frame.locator('xpath=html/body/div/div/div/main/main/div/div/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Test User')
        

        frame = context.pages[-1]
        # Enter email
        elem = frame.locator('xpath=html/body/div/div/div/main/main/div/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('spcs0404@gmail.com')
        

        frame = context.pages[-1]
        # Enter phone number
        elem = frame.locator('xpath=html/body/div/div/div/main/main/div/div/form/div[3]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('1234567890')
        

        frame = context.pages[-1]
        # Enter password
        elem = frame.locator('xpath=html/body/div/div/div/main/main/div/div/form/div[4]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('spj040506')
        

        frame = context.pages[-1]
        # Enter confirm password
        elem = frame.locator('xpath=html/body/div/div/div/main/main/div/div/form/div[5]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('spj040506')
        

        frame = context.pages[-1]
        # Select Job Seeker role
        elem = frame.locator('xpath=html/body/div/div/div/main/main/div/div/form/div[6]/label/span/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the Register button to submit the registration form.
        frame = context.pages[-1]
        # Click the Register button to submit the registration form.
        elem = frame.locator('xpath=html/body/div/div/div/main/main/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Try registering with a different valid email address to check if the issue is due to duplicate email.
        frame = context.pages[-1]
        # Change email to a different valid email to avoid duplication issues.
        elem = frame.locator('xpath=html/body/div/div/div/main/main/div/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('spcs0404+test@gmail.com')
        

        frame = context.pages[-1]
        # Click Register button to submit the form with new email.
        elem = frame.locator('xpath=html/body/div/div/div/main/main/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Input the registered email and password on the login page and submit to verify successful login.
        frame = context.pages[-1]
        # Enter registered email on login page
        elem = frame.locator('xpath=html/body/div/div/div/main/main/div/div/div/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('spcs0404+test@gmail.com')
        

        frame = context.pages[-1]
        # Enter password on login page
        elem = frame.locator('xpath=html/body/div/div/div/main/main/div/div/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('spj040506')
        

        frame = context.pages[-1]
        # Click the Login button to submit login form
        elem = frame.locator('xpath=html/body/div/div/div/main/main/div/div/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Welcome back, Job Seeker!').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=8').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=4').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=75%').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Complete').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=In Progress').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    