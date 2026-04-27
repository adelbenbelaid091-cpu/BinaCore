export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-primary mb-4">BinaCore</h1>
        <p className="text-muted-foreground mb-4">Application is working!</p>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm">Environment Check:</p>
          <p className="text-xs mt-2 text-muted-foreground">
            NEXT_PUBLIC_SUPABASE_URL: {typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Not set'}
          </p>
        </div>
      </div>
    </div>
  )
}
