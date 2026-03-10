
import NavBar from '../../components/NavBar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <div style={{ paddingBottom: 64 }}>
        {children}
      </div>
    </>
  );
}
