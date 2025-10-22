export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[360px] sm:w-[400px] rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-4">
      {children}
    </div>
  );
}


