import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-4 py-6">
            <SidebarMenu className="gap-4">
                {items.map((item) => {
                    const isActive = isCurrentOrParentUrl(item.href);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className={
                                    isActive
                                        ? 'rounded-xl !bg-[#1a56ff] px-4 py-6 !text-white hover:!bg-[#1a56ff]/90'
                                        : 'px-4 py-6 text-slate-500 hover:text-slate-900'
                                }
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    className="flex items-center gap-3"
                                >
                                    {item.icon && (
                                        <item.icon className="size-5" />
                                    )}
                                    <span className="text-[15px] font-medium">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
