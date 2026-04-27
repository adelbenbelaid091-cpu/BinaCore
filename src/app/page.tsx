export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-primary">BinaCore</h1>
          <p className="text-muted-foreground">Construction Project Management</p>
        </div>
        <div className="p-4 bg-muted rounded-lg max-w-md mx-auto">
          <p className="text-sm font-medium mb-2">Application Status</p>
          <p className="text-xs text-muted-foreground">
            The application is deployed and running on Vercel.
          </p>
        </div>
      </div>
    </div>
  )
}
