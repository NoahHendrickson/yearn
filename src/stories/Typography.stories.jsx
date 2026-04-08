export default {
  title: 'Foundation/Typography',
  parameters: {
    layout: 'padded',
    controls: { hideNoControlsWarning: true },
    docs: {
      description: {
        component: 'Type scale and font styles used across the Yearn design system.',
      },
    },
  },
}

const sizes = [
  { label: 'text-xs',  className: 'text-xs',  size: '12px', lineHeight: '18px' },
  { label: 'text-sm',  className: 'text-sm',  size: '14px', lineHeight: '20px' },
  { label: 'text-md',  className: 'text-md',  size: '16px', lineHeight: '24px' },
  { label: 'text-lg',  className: 'text-lg',  size: '18px', lineHeight: '28px' },
  { label: 'text-xl',  className: 'text-xl',  size: '20px', lineHeight: '30px' },
]

const weights = [
  { label: 'Regular',   className: 'font-normal',    weight: '400' },
  { label: 'Medium',    className: 'font-medium',    weight: '500' },
  { label: 'Semibold',  className: 'font-semibold',  weight: '600' },
  { label: 'Bold',      className: 'font-bold',      weight: '700' },
]

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <p className="text-xs font-semibold tracking-widest uppercase text-text-tertiary whitespace-nowrap">
          {title}
        </p>
        <div className="h-px bg-border-primary flex-1" />
      </div>
      {children}
    </div>
  )
}

function Row({ meta, children }) {
  return (
    <div className="flex items-baseline gap-8">
      <div className="w-40 shrink-0">
        {meta.map((m, i) => (
          <p key={i} className="text-xs text-text-tertiary font-mono">{m}</p>
        ))}
      </div>
      {children}
    </div>
  )
}

export const TypeScale = {
  name: 'Type scale',
  render: () => (
    <div className="flex flex-col gap-12 max-w-3xl py-4">
      <Section title="Size scale">
        {sizes.map(s => (
          <Row key={s.label} meta={[s.label, `${s.size} / ${s.lineHeight}`]}>
            <p className={`${s.className} text-text-primary`}>
              The quick brown fox jumps over the lazy dog
            </p>
          </Row>
        ))}
      </Section>

      <Section title="Weights (text-md)">
        {weights.map(w => (
          <Row key={w.label} meta={[w.label, `${w.weight}`]}>
            <p className={`text-md ${w.className} text-text-primary`}>
              The quick brown fox jumps over the lazy dog
            </p>
          </Row>
        ))}
      </Section>

      <Section title="Color tokens">
        {[
          { label: 'text-text-primary',       className: 'text-text-primary',       desc: 'Body, headings' },
          { label: 'text-text-secondary',      className: 'text-text-secondary',     desc: 'Labels, supporting' },
          { label: 'text-text-tertiary',       className: 'text-text-tertiary',      desc: 'Hints, metadata' },
          { label: 'text-text-placeholder',    className: 'text-text-placeholder',   desc: 'Input placeholders' },
          { label: 'text-fg-brand-primary',    className: 'text-fg-brand-primary',   desc: 'Brand accent' },
          { label: 'text-fg-error-primary',    className: 'text-fg-error-primary',   desc: 'Error messages' },
        ].map(t => (
          <Row key={t.label} meta={[t.label, t.desc]}>
            <p className={`text-md font-medium ${t.className}`}>
              The quick brown fox jumps over the lazy dog
            </p>
          </Row>
        ))}
      </Section>

      <Section title="Font families">
        <Row meta={['font-body', 'Geist — UI text']}>
          <p className="text-md text-text-primary font-body">
            The quick brown fox jumps over the lazy dog
          </p>
        </Row>
        <Row meta={['font-mono', 'Geist Mono — code, data']}>
          <p className="text-md text-text-primary font-mono">
            The quick brown fox jumps over the lazy dog
          </p>
        </Row>
        <Row meta={['Brand wordmark', 'text-fg-brand-primary']}>
          <p className="text-2xl font-semibold text-fg-brand-primary tracking-tight">
            Yearn
          </p>
        </Row>
      </Section>
    </div>
  ),
}
