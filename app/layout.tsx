import './globals.css';

export const metadata = {
  title: 'Moyag AI SEO Growth Agent',
  description: 'Free website SEO diagnosis for export businesses and global websites.'
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{props.children}</body>
    </html>
  );
}
