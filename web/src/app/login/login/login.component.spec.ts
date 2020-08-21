import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser'

import { FormBuilder } from '@angular/forms';

import { LoginComponent } from './login.component';
import { AuthService } from '@login/services/auth/auth.service';
import { AuthServiceMock } from '@login/services/auth/auth.service.mock';
import { of } from 'rxjs';

import { click } from '@testing/test-util/test-util.service'
import { SharedModule } from '@shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterLinkDirectiveStub } from '@testing/router-link-directive-stub'
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent
  let fixture: ComponentFixture<LoginComponent>
  let loginDe: DebugElement
  let loginEl: HTMLElement

  let page: Page

  let loginSpy: jasmine.Spy

  // page class for ease of testing
  class Page {
    // getter properties wat to query the DOM until called.
    get buttons()         { return this.queryAll<HTMLButtonElement>('button') }
    get loginBtn()        { return this.buttons[0] }
    get signupBtn()       { return this.buttons[1] }
    get inputs()          { return this.queryAll<HTMLInputElement>('input') }
    get emailInput()      { return this.inputs[0] }
    get passwordInput()   { return this.inputs[1] }

    routerLinks: RouterLinkDirectiveStub[]

    constructor(someFixture: ComponentFixture<LoginComponent>) {
      // get the router links from the stubbed directive
      const deEl = someFixture.debugElement
      const linkDes = deEl.queryAll(By.directive(RouterLinkDirectiveStub))
      this.routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub))
    }
    
    /// query helpers ///
    private query<T>(selector: string): T {
      return fixture.nativeElement.querySelector(selector)
    }

    private queryAll<T>(selector: string): T {
      return fixture.nativeElement.querySelectorAll(selector)
    }
  }

  function createComponent() {
    fixture = TestBed.createComponent(LoginComponent)
    component = fixture.componentInstance
    page = new Page(fixture)

    // first change detection triggers the components onInit() function
    fixture.detectChanges()
  }

  beforeEach(async(() => {
    // create a fake AuthService object with a 'login()' spy
    const authService = jasmine.createSpyObj('AuthService', ['login'])

    loginSpy = authService.login.and.returnValue( of({}) )

    TestBed.configureTestingModule({
      imports:      [ SharedModule, NoopAnimationsModule ],
      declarations: [ LoginComponent, RouterLinkDirectiveStub ],
      providers:  [
        { provide: AuthService, useValue: authService },// useClass: AuthServiceMock },
        { provide: FormBuilder}
      ]
    })
    .compileComponents()
  }));

  // create the component before each
  beforeEach(async(createComponent))

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid login form', () => {
    component.loginForm.controls['email'].setValue('');
    expect(component.loginForm.get('email').valid).toBeFalsy('email is required')

    component.loginForm.controls['email'].setValue('test');
    expect(component.loginForm.get('email').valid).toBeFalsy('email should be in email format')

    component.loginForm.controls['password'].setValue('');
    expect(component.loginForm.get('password').valid).toBeFalsy('password is required');
  });

  it('should have a valid login form', () => {
    component.loginForm.controls['email'].setValue('test@mail.com');
    component.loginForm.controls['password'].setValue('testpassword');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call the authService login method', () => {
    
    // set a valid login form
    component.loginForm.patchValue({
      email: 'test@mail.com',
      password: 'testpassword'
    })

    // login spy should not have been called yet
    expect(loginSpy.calls.any()).toBe(false, 'AuthService login() method not to have been called')

    click(page.loginBtn)
    expect(loginSpy.calls.any()).toBe(true, 'AuthService login() method to have been called')

  })

  it('should link the page form and component form', () => {
    const testEmail = 'test@mail.com'
    const testPassword = 'testpassword'

    const emailInput = page.emailInput
    const passwordInput = page.passwordInput

    // expect an empty form
    expect(component.loginForm.get('email').value).toBe('', 'component form email should be empty')
    expect(component.loginForm.get('password').value).toBe('', 'component form password should be empty')

    // set the html inputs
    emailInput.value = testEmail
    passwordInput.value = testPassword

    // dispatch a DOM event so that Angular learns of input value change.
    emailInput.dispatchEvent(new Event('input'))
    passwordInput.dispatchEvent(new Event('input'))

    // validate the form values are populated
    expect(component.loginForm.get('email').value).toBe(testEmail, 'email input should be linked to form')
    expect(component.loginForm.get('password').value).toBe(testPassword, 'password input should be linked to form')
  })
    
  it('can get RouterLinks from template', () => {
    const routerLinks = page.routerLinks
    expect(routerLinks.length).toBe(1, 'should have 1 routerLinks')
    expect(routerLinks[0].linkParams).toBe('/signup')
  })

  it('should route to the signup page on signup button click', () => {
    const signupLink = page.routerLinks[0]

    expect(signupLink.navigatedTo).toBeNull('should not have navigated yet')

    click(page.signupBtn)
    expect(signupLink.navigatedTo).toBe('/signup')
  });
});
