import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("loaders", "routes/loaders.tsx"),
  layout("routes/products/layout.tsx", [
    route("products", "routes/products/index.tsx"),
    route("products/:id", "routes/products/detail.tsx"),
  ]),
  route("forms", "routes/forms.tsx"),
  route("tform", "routes/tform.tsx"),
] satisfies RouteConfig;
