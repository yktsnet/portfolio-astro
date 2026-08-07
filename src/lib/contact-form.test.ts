// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { buildContactBody } from './contact-form';

// contact.astro のフォーム構造（name 属性）を最小再現する。
function makeForm(overrides?: { message?: string; turnstile?: boolean }): HTMLFormElement {
  const form = document.createElement('form');
  form.id = 'contact-form';
  form.innerHTML = `
    <input type="text" id="cf-name" name="name" />
    <input type="email" id="cf-email" name="email" />
    <input type="tel" id="cf-phone" name="phone" />
    <textarea id="cf-message" name="message"></textarea>
    <div class="cf-turnstile"></div>
  `;
  document.body.appendChild(form);

  (form.elements.namedItem('name') as HTMLInputElement).value = '山田太郎';
  (form.elements.namedItem('email') as HTMLInputElement).value = 'yamada@example.com';
  (form.elements.namedItem('phone') as HTMLInputElement).value = '090-0000-0000';

  if (overrides?.message !== undefined) {
    (form.elements.namedItem('message') as HTMLTextAreaElement).value = overrides.message;
  }

  if (overrides?.turnstile) {
    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.name = 'cf-turnstile-response';
    hidden.value = 'dummy-token';
    form.querySelector('.cf-turnstile')?.appendChild(hidden);
  }

  return form;
}

describe('buildContactBody', () => {
  it('returns the entered values for all four fields', () => {
    const form = makeForm({ message: 'よろしくお願いします', turnstile: true });
    const body = buildContactBody(form);

    expect(body.name).toBe('山田太郎');
    expect(body.email).toBe('yamada@example.com');
    expect(body.phone).toBe('090-0000-0000');
    expect(body.message).toBe('よろしくお願いします');
    expect(body.cfToken).toBe('dummy-token');
  });

  it('is not shadowed by HTMLFormElement built-in properties (regression for the name field bug)', () => {
    const form = makeForm();

    // form に name 属性が無いフォームでは form.name は '' を返し、"".value は undefined になる。
    // buildContactBody はこの罠を経由せず入力値を返さなければならない。
    expect(form.name).toBe('');
    expect(buildContactBody(form).name).toBe('山田太郎');
  });

  it('returns an empty string, not undefined, when message and cf-turnstile-response are absent', () => {
    const form = makeForm();
    const body = buildContactBody(form);

    expect(body.message).toBe('');
    expect(body.message).not.toBeUndefined();
    expect(body.cfToken).toBe('');
    expect(body.cfToken).not.toBeUndefined();
    expect(JSON.stringify(body)).toContain('"message":""');
    expect(JSON.stringify(body)).toContain('"cfToken":""');
  });
});
