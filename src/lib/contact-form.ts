export type ContactBody = {
  name: string;
  email: string;
  phone: string;
  message: string;
  cfToken: string;
};

// form.elements.namedItem() は Element | RadioNodeList | null を返すため、
// value を持つ具体型に絞り込んでから読む。`form[name]` は使わない
// （HTMLFormElement 組み込みプロパティ（name/action/method/id/elements 等）と
// 同名の input が shadow される不具合の原因そのもののため）。
function getFieldValue(form: HTMLFormElement, name: string): string {
  const el = form.elements.namedItem(name);
  if (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement
  ) {
    return el.value;
  }
  if (el instanceof RadioNodeList) {
    return String(el.value);
  }
  return '';
}

export function buildContactBody(form: HTMLFormElement): ContactBody {
  return {
    name: getFieldValue(form, 'name'),
    email: getFieldValue(form, 'email'),
    phone: getFieldValue(form, 'phone'),
    message: getFieldValue(form, 'message'),
    cfToken: getFieldValue(form, 'cf-turnstile-response'),
  };
}
