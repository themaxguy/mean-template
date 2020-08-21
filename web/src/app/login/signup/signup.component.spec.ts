import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FormBuilder, Validators } from '@angular/forms'

import { SignupComponent } from './signup.component'
import { AuthService } from '@login/services/auth/auth.service'
import { AuthServiceMock } from '@login/services/auth/auth.service.mock'
import { By } from '@angular/platform-browser'
import { RouterLinkDirectiveStub } from '@testing/router-link-directive-stub'
import { SharedModule } from '@shared/shared.module'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { of } from 'rxjs'

import { click } from '@testing/test-util/test-util.service'

describe('SignupComponent', () => {
  let component: SignupComponent
  let fixture: ComponentFixture<SignupComponent>
  let page: Page

  let signupSpy: jasmine.Spy

  class Page {
    get buttons()   { return this.queryAll<HTMLButtonElement>('button') }
    get signupBtn() { return this.buttons[0] }
    get loginBtn()  { return this.buttons[1] }
    get inputs()    { return this.queryAll<HTMLInputElement>('input') }
    get firstNameInput() { return this.inputs[0] }
    get lastNameInput() { return this.inputs[1] }
    get emailInput()      { return this.inputs[2] }
    get usernameInput() { return this.inputs[3] }
    get passwordInput()   { return this.inputs[4] }
    get confPasswordInput()   { return this.inputs[5] }
    get routerLinks() { return this.queryRouterLinks() }

    // routerLinks: RouterLinkDirectiveStub[]

    constructor(someFixture: ComponentFixture<SignupComponent>) { }

    /// helper functions ///
    private query<T>(selector: string): T {
      return fixture.nativeElement.querySelector(selector)
    }

    private queryRouterLinks(): RouterLinkDirectiveStub[] {
      return fixture.debugElement
      .queryAll(By.directive(RouterLinkDirectiveStub))
      .map(el => el.injector.get(RouterLinkDirectiveStub))
    }

    private queryAll<T>(selector: string): T {
      return fixture.nativeElement.querySelectorAll(selector)
    }

  }

  function createComponent() {
    fixture = TestBed.createComponent(SignupComponent)
    component = fixture.componentInstance
    page = new Page(fixture)
    fixture.detectChanges()   // runs ngOnInit()
  }

  beforeEach(async(() => {
    const authService = jasmine.createSpyObj('AuthService', ['signup'])
    signupSpy = authService.signup.and.returnValue(of({}))

    TestBed.configureTestingModule({
      imports:      [ SharedModule, NoopAnimationsModule ],
      declarations: [ SignupComponent, RouterLinkDirectiveStub ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: FormBuilder}
      ]
    })
    .compileComponents()
  }))

  beforeEach(async(createComponent))

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have an initially blank form', () => {
    expect(component.signupForm.get('firstName').value).toBe('', 'firstName should initially be empty')
    expect(component.signupForm.get('lastName').value).toBe('', 'lastName should initially be empty')
    expect(component.signupForm.get('email').value).toBe('', 'email should initially be empty')
    expect(component.signupForm.get('username').value).toBe('', 'username should initially be empty')
    expect(component.signupForm.get('password').value).toBe('', 'password should initially be empty')
    expect(component.signupForm.get('confirmPassword').value).toBe('', 'confirmPassword should initially be empty')
  })

  it('should update the signup form when inputs are entered', () => {
    // Set html inputs
    page.firstNameInput.value = 'testValue'
    page.lastNameInput.value = 'testValue'
    page.emailInput.value = 'testValue@test.com'
    page.usernameInput.value = 'testValue'
    page.passwordInput.value = 'testValue'
    page.confPasswordInput.value = 'testValue'

    // Dispatch DOM events to update the angular form in the component    
    page.firstNameInput.dispatchEvent(new Event('input'))
    page.lastNameInput.dispatchEvent(new Event('input'))
    page.emailInput.dispatchEvent(new Event('input'))
    page.usernameInput.dispatchEvent(new Event('input'))
    page.passwordInput.dispatchEvent(new Event('input'))
    page.confPasswordInput.dispatchEvent(new Event('input'))

    // Expect component form values to equal what was entered in the html
    expect(component.signupForm.get('firstName').value).toBe('testValue')
    expect(component.signupForm.get('lastName').value).toBe('testValue')
    expect(component.signupForm.get('email').value).toBe('testValue@test.com')
    expect(component.signupForm.get('username').value).toBe('testValue')
    expect(component.signupForm.get('password').value).toBe('testValue')
    expect(component.signupForm.get('confirmPassword').value).toBe('testValue')        
  })

  it('should have an invalid signup form', () => {
    // Expect form to be initially invalid
    expect(component.signupForm.valid).toBeFalsy()

    // Set component form values
    component.signupForm.patchValue({
      firstName: 'testValue',
      lastName: 'testValue',
      email: 'testValue',
      username: 'testValue',
      password: 'testValue',
      confPassword: 'differentTestValue'
    })
    
    // form should still be invalid with differing passwords
    expect(component.signupForm.valid).toBeFalsy('signup form should be falsy')

  })

  it('should have a valid signup form', () => {
    // Set the form controls to valid values
    component.signupForm.patchValue({
      firstName: 'testFirst',
      lastName: 'testLast',
      email: 'test@mail.com',
      username: 'testUserName',
      password: 'testPassword',
      confirmPassword: 'testPassword'
    })
    expect(component.signupForm.valid).toBeTrue()
  })

  it(`should call AuthService's signup function in signup() when the signup button is clicked`, () => {
    // Assign valid values to the signupForm so the onSubmit method can complete
    component.signupForm.patchValue({
      firstName: 'testFirst',
      lastName: 'testLast',
      email: 'test@mail.com',
      username: 'testUserName',
      password: 'testPassword',
      confirmPassword: 'testPassword'
    })

    // expect the signup spy not to have been called
    expect(signupSpy.calls.any()).toBe(false, 'AuthService signup() should not have been called')

    // Click the signup button
    click(page.signupBtn)

    // expect the signup spy to have been called
    expect(signupSpy.calls.any()).toBe(true, 'AuthService signup() should have been called')
  })

  it('can get RouterLinks from the template', () => {
    const routerLinks = page.routerLinks
    expect(routerLinks.length).toBe(1, 'should have 1 routerLink')
    expect(routerLinks[0].linkParams).toBe('/login')
  })

  it(`should route to the login page when the `, () => {
    // Get login link and expect it not to have been navigated to yet
    const loginLink = page.routerLinks[0]
    expect(loginLink.navigatedTo).toBeNull('should not have navigated yet')

    // Click login button
    click(page.loginBtn)

    // Expect route to be navigated to
    expect(loginLink.navigatedTo).toBe('/login')
  })

})
