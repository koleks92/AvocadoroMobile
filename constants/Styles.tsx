import { Colors } from "./Colors";
import { Sizes } from "./Sizes";

export const textDefault = {
    color: Colors.white,
    fontFamily: "MontserratSemiBold",
} as const;

export const rootStyles = {
    flex: 1,
    backgroundColor: Colors.background2,
    margin: Sizes.rootMargin,
    paddingHorizontal: Sizes.rootPaddingHorizontal,
    paddingVertical: Sizes.rootPaddingVertical,
    borderRadius: Sizes.rootMargin,
    justifyContent: "center",
    alignItems: "center",
} as const;
