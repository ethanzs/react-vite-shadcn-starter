import {HTMLAttributes} from "react";
import {Property} from "csstype";

export interface BaseComponentPropType<T> extends HTMLAttributes<T> {
    background?: Property.Background;
    padding?: Property.Padding;
}

export interface BaseComponentPropTypeExplicit {
    background?: Property.Background;
    padding?: Property.Padding;
}

export interface LogoComponentPropType extends BaseComponentPropType<HTMLOrSVGElement> {
    size?: number;
}