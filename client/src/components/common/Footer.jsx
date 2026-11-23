
import { Link } from "react-router-dom";
import { HeartPulse } from "lucide-react";
import {
    FaInstagram,
    FaFacebookF,
    FaYoutube,
} from "react-icons/fa";

const groups = [
    {
        title: "Explore",
        links: [
            ["About Us", "/#about"],
            ["Find Blood", "/resources"],
            ["Donation Camps", "/camps"],
            ["Become a Donor", "/donate"],
            ["Contact Us", "/contact"],
        ],
    },
    {
        title: "Support",
        links: [
            ["Help Center", "/faq"],
            ["Frequently Asked Questions", "/faq"],
            ["How GlobinPlus Works", "/faq"],
            ["Report an Issue", "/contact"],
            ["Contact Support", "/contact"],
        ],
    },
    {
        title: "Legal",
        links: [
            ["Privacy Policy", "/privacy"],
            ["Terms & Conditions", "/terms"],
            ["Medical Disclaimer", "/disclaimer"],
            ["Data Protection", "/privacy"],
            ["Cookie Policy", "/privacy"],
        ],
    },
];

export default function Footer() {
    return (
        <footer className="new-footer">
            <div className="footer-inner">

                {/* About Section */}
                <div className="footer-about">
                    <Link to="/">
                        <img
                            src="/globinplus-logo.png"
                            alt="GlobinPlus"
                        />
                    </Link>

                    <h2>Together, we save lives.</h2>

                    <p>
                        Connecting patients, donors and hospitals
                        with the tools to build a healthier community.
                    </p>

                    {/* Social Media */}
                    <div className="footer-social">
                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <FaInstagram size={20} />
                        </a>

                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <FaFacebookF size={20} />
                        </a>

                        <a
                            href="https://www.youtube.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                        >
                            <FaYoutube size={20} />
                        </a>
                    </div>
                </div>

                {/* Footer Navigation */}
                {groups.map((group) => (
                    <div
                        className="footer-column"
                        key={group.title}
                    >
                        <h3>{group.title}</h3>

                        {group.links.map(([name, to]) => (
                            <Link key={name} to={to}>
                                {name}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <span>
                    © {new Date().getFullYear()} GlobinPlus.
                    All rights reserved.
                </span>

                <span className="flex items-center gap-2">
                    <HeartPulse size={16} />
                    Together, We Save Lives.
                </span>
            </div>

            {/* Medical Disclaimer */}
            <p className="footer-disclaimer">
                GlobinPlus provides informational tools and
                does not offer medical advice or guarantee
                blood availability. In an emergency, contact
                local emergency services and a licensed
                healthcare provider.
            </p>
        </footer>
    );
}
