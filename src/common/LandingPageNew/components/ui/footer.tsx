import Logo from './logo';

export default function Footer({ border = false }: { border?: boolean }) {
  return (
    <footer className={'my-5 flex justify-center items-center'}>
      <div className="flex gap-2 items-center mx-auto max-w-6xl px-4 sm:px-6">
        <Logo />
        <div className="text-sm text-gray-600">
          ©{new Date().getFullYear()} Copyright <strong>SUSS</strong>. All
          Rights Reserved{' '}
        </div>
      </div>
    </footer>
  );
}
