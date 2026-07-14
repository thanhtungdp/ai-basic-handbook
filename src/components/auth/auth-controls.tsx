import { SignInButton, UserButton, Show } from '@clerk/nextjs';

export function AuthControls() {
  return (
    <div className="flex items-center gap-2 order-last">
      <Show when="signed-out">
        <SignInButton
          mode="redirect"
          fallbackRedirectUrl="/docs"
          signUpFallbackRedirectUrl="/docs"
        >
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Đăng nhập
          </button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
