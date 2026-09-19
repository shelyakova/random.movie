import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {/* config options here */};

export default withFlowbiteReact(withNextIntl(nextConfig));
