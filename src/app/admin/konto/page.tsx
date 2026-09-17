import { requireAdmin } from "@/lib/auth";
import { changePassword } from "../actions";
import { ActionForm, SubmitButton } from "../_components/ActionForm";
import { Card, Field, Input } from "../_components/fields";

export default async function AccountPage() {
  const user = await requireAdmin();
  return (
    <div className="max-w-md space-y-6">
      <h1 className="font-display text-3xl font-medium">Mitt konto</h1>
      <Card title="Byt lösenord">
        <p className="mb-4 text-sm text-muted">Inloggad som {user.email}.</p>
        <ActionForm action={changePassword} className="space-y-4">
          <Field label="Nytt lösenord" hint="Minst 10 tecken.">
            <Input name="password" type="password" required />
          </Field>
          <Field label="Upprepa lösenordet">
            <Input name="password2" type="password" required />
          </Field>
          <SubmitButton>Byt lösenord</SubmitButton>
        </ActionForm>
      </Card>
    </div>
  );
}
