import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import UpgradeButton from './UpgradeButton'

const formatNumber = (value: number) => String(value)

describe('UpgradeButton', () => {
  it('buys from a button and opens details from the icon button', () => {
    const onClick = vi.fn()
    const onIconClick = vi.fn()
    render(
      <UpgradeButton
        icon={<span>sword</span>}
        title="Plant Damage"
        level={2}
        cost={18}
        count={1}
        canAfford
        effect="x1.15"
        onClick={onClick}
        onIconClick={onIconClick}
        formatNumber={formatNumber}
        lang="en"
        accentClass="border-l-4"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /plant damage/i }))
    expect(onIconClick).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole('button', { name: /upgrades/i }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('disables the purchase when the player cannot afford it', () => {
    render(
      <UpgradeButton
        icon={<span>sword</span>}
        title="Plant Damage"
        level={1}
        cost={40}
        count={1}
        canAfford={false}
        effect="x1"
        onClick={vi.fn()}
        formatNumber={formatNumber}
        lang="en"
        accentClass=""
      />,
    )
    expect(screen.getByRole('button', { name: /upgrades/i })).toHaveProperty('disabled', true)
  })

  it('shows a locked reason instead of a purchase', () => {
    render(
      <UpgradeButton
        icon={<span>sun</span>}
        title="Sol Generator"
        level={0}
        cost={0}
        count={0}
        canAfford={false}
        effect="Locked"
        onClick={vi.fn()}
        formatNumber={formatNumber}
        lang="en"
        accentClass=""
        unavailableReason="Unlocks at plant level 500"
      />,
    )
    expect(screen.getByText('Unlocks at plant level 500').textContent).toContain('500')
    expect(screen.queryByRole('button', { name: /upgrades/i })).toBeNull()
  })
})
