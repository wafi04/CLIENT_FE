import { ReactNode } from "react";

const HeaderDashboard = ({
  title,
  subTitle,
  children,
}: {
  title: string;
  subTitle: string;
  children: ReactNode;
}) => {
  return (
    <section className="bg-white px-6 flex justify-between items-center py-8 border-b border-gray-200">
      <div className="w-full mx-auto">
        <div className="flex flex-col space-y-1">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

          {/* Subtitle */}
          <p className="text-sm text-gray-500">{subTitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
};

export default HeaderDashboard;
