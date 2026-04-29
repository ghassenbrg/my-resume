export type ContactField = 'name' | 'email' | 'message'
export type ContactStatus = 'idle' | 'sending' | 'sent' | 'error'

export interface ContactFormState {
  name: string
  email: string
  message: string
}

export type ContactFormErrors = Record<ContactField, string>

export interface ContactValidationMessages {
  nameRequired: string
  emailRequired: string
  emailInvalid: string
  messageRequired: string
}

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

export const defaultContactValidationMessages: ContactValidationMessages = {
  nameRequired: 'Name is required.',
  emailRequired: 'Email is required.',
  emailInvalid: 'Enter a valid email address.',
  messageRequired: 'Message is required.',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateContactField = (
  field: ContactField,
  form: ContactFormState,
  errors: ContactFormErrors = createContactFormErrors(),
  messages: ContactValidationMessages = defaultContactValidationMessages,
) => {
  if (field === 'name') {
    errors.name = form.name.trim() ? '' : messages.nameRequired
  }

  if (field === 'email') {
    errors.email = form.email.trim()
      ? emailPattern.test(form.email.trim())
        ? ''
        : messages.emailInvalid
      : messages.emailRequired
  }

  if (field === 'message') {
    errors.message = form.message.trim() ? '' : messages.messageRequired
  }

  return !errors[field]
}

export const validateContactForm = (
  form: ContactFormState,
  errors: ContactFormErrors = createContactFormErrors(),
  messages: ContactValidationMessages = defaultContactValidationMessages,
) => {
  const fields: ContactField[] = ['name', 'email', 'message']

  return fields.map((field) => validateContactField(field, form, errors, messages)).every(Boolean)
}
