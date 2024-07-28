import { lazy, Suspense } from "react";
import { Spin } from "antd";

const LazyRouter = (lazyComponent: any) => {
  const Comp = lazy(lazyComponent);
  return (props: any) => (
    <Suspense fallback={<Spin size={"large"} />}>
      <Comp {...props} />
    </Suspense>
  );
};

export default LazyRouter;
