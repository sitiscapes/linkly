import { BarChart3, Globe, Shield, Zap } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate short links instantly with our optimized infrastructure.",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Track clicks, locations, and devices with real-time analytics.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee.",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description: "Use your own domain for branded, professional short links.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border bg-secondary/30 px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Everything you need</h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Powerful features to help you manage and track your links effortlessly.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary transition-colors group-hover:bg-primary/10">
                <feature.icon className="h-6 w-6 text-accent transition-colors group-hover:text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}