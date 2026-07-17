import AuthSplitLayoutTemplate from '@/layouts/auth/auth-split-layout';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <AuthSplitLayoutTemplate title={title} description={description}>
            {children}
        </AuthSplitLayoutTemplate>
    );
}
