import type { IFooter } from "../types";

export const footerData: IFooter[] = [
    {
        title: "Product",
        links: [
            { name: "Home", href: "/" },
            { name: "Generate", href: "/generate" },
            { name: "My Generations", href: "/my-generation" },
            { name: "Pricing", href: "/#pricing" },
        ]
    },
    {
        title: "Support",
        links: [
            { name: "Contact Us", href: "/contact" },
            { name: "Features", href: "/#features" },
            { name: "Testimonials", href: "/#testimonials" },
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", href: "#" },
            { name: "Terms of Service", href: "#" },
        ]
    }
];