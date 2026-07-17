import { usePage } from '@inertiajs/react';
import * as React from 'react';
import { ToastContainer, toast } from 'react-toastify';

type PageProps = {
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    errors?: Record<string, string>;
};

export function AppToast() {
    const { flash, errors } = usePage<PageProps>().props;
    const shownMessageRef = React.useRef<string | null>(null);

    React.useEffect(() => {
        if (
            flash?.success &&
            shownMessageRef.current !== `success:${flash.success}`
        ) {
            toast.success(flash.success);
            shownMessageRef.current = `success:${flash.success}`;
        }
    }, [flash?.success]);

    React.useEffect(() => {
        if (
            flash?.error &&
            shownMessageRef.current !== `error:${flash.error}`
        ) {
            toast.error(flash.error);
            shownMessageRef.current = `error:${flash.error}`;
        }
    }, [flash?.error]);

    React.useEffect(() => {
        const firstError = errors ? Object.values(errors)[0] : null;

        if (
            firstError &&
            shownMessageRef.current !== `validation:${firstError}`
        ) {
            toast.error(firstError);
            shownMessageRef.current = `validation:${firstError}`;
        }
    }, [errors]);

    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="light"
            toastClassName="!rounded-xl !border !border-slate-200 !shadow-lg"
        />
    );
}
