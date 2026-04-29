export type ContactField = 'name' | 'email' | 'message'
export type ContactStatus = 'idle' | 'sending' | 'sent' | 'error'

export interface ContactFormState {
  name: string
  email: string
  message: string
}

export type ContactFormErrors = Record<ContactField, string>

export const createContactFormState = (): ContactFormState => ({
  name: '',
  email: '',
  message: '',
})

export const createContactFormErrors = (): ContactFormErrors => ({
  name: '',
  email: '',
  message: '',
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateContactField = (
  field: ContactField,
  form: ContactFormState,
  errors: ContactFormErrors = createContactFormErrors(),
) => {
  if (field === 'name') {
    errors.name = form.name.trim() ? '' : 'Name is required.'
  }

  if (field === 'email') {
    errors.email = form.email.trim()
      ? emailPattern.test(form.email.trim())
        ? ''
        : 'Enter a valid email address.'
      : 'Email is required.'
  }

  if (field === 'message') {
    errors.message = form.message.trim() ? '' : 'Message is required.'
  }

  return !errors[field]
}

export const validateContactForm = (
  form: ContactFormState,
  errors: ContactFormErrors = createContactFormErrors(),
) => {
  const fields: ContactField[] = ['name', 'email', 'message']

  return fields.map((field) => validateContactField(field, form, errors)).every(Boolean)
}
