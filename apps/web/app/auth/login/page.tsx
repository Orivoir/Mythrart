import { Container } from "@/components/ui/layout/container"
import { Title as AuthTitle } from "@/components/auth/Title"
import { Subtitle as AuthSubtitle } from "@/components/auth/Subtitle"
import { CTAAuthList } from "@/components/auth/cta/cta-auth-list"
import { AuthForm } from "@/components/auth/form"
import { SplitLayout } from "@/components/ui/layout/split"

export default function LoginPage() {

  return (
    <Container className="relative overflow-hidden">      
      
      <SplitLayout className="
        items-start
      ">
        
        <div className="
          flex
          flex-col
          gap-8
          xl:flex-1
          w-full
        ">
          <AuthTitle />
          <AuthSubtitle />
          <CTAAuthList />
        </div>

        <div className="
          flex
          flex-col
          xl:flex-1
          w-full
        ">
          <AuthForm />
        </div>

      </SplitLayout>
    </Container>
  )
}
