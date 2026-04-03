import React from 'react';
import ContactSection from '../sections/ContactSection';
import SoftBackdrop from '../components/SoftBackdrop';

export default function MyContact() {
    return (
        <>
            <SoftBackdrop />
            <div className="pt-24 pb-12 min-h-screen">
                <ContactSection />
            </div>
        </>
    );
}
