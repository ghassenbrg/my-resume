import { describe, expect, it } from 'vitest'
import {
  createContactFormErrors,
  createContactFormState,
  validateContactField,
  validateContactForm,
} from '~/composables/useContactForm'

describe('contact section validation', () => {
  it('blocks empty required fields with actionable messages', () => {
    const form = createContactFormState()
    const errors = createContactFormErrors()

    expect(validateContactForm(form, errors)).toBe(false)
    expect(errors).toEqual({
      name: 'Name is required.',
      email: 'Email is required.',
      message: 'Message is required.',
    })
  })

  it('recovers field errors after valid input', () => {
    const form = createContactFormState()
    const errors = createContactFormErrors()

    validateContactField('email', form, errors)
    expect(errors.email).toBe('Email is required.')

    form.email = 'visitor@example.com'
    expect(validateContactField('email', form, errors)).toBe(true)
    expect(errors.email).toBe('')
  })
})
