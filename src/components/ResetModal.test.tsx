import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ResetModal from './ResetModal'

describe('ResetModal', () => {
  it('cancels with the cancel label and confirms the prestige', () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    render(<ResetModal resets={1} onCancel={onCancel} onConfirm={onConfirm} lang="en" />)

    expect(screen.getByRole('button', { name: 'Cancel' }).textContent).toBe('Cancel')
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole('button', { name: 'Confirm Reset' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })
})
