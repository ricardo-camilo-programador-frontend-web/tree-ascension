import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { dismissOnboarding, hasSeenOnboarding, OnboardingHint } from './OnboardingHint'

describe('onboarding hint', () => {
  it('starts unseen and stays dismissed', () => {
    localStorage.clear()
    expect(hasSeenOnboarding()).toBe(false)
    dismissOnboarding()
    expect(hasSeenOnboarding()).toBe(true)
  })

  it('asks the player to dismiss the hint', () => {
    const onDismiss = vi.fn()
    render(<OnboardingHint lang="en" onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
