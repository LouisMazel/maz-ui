import { Component, h, Prop, State, Host } from '@stencil/core';

/**
 * @customDescription This is just the best button around!
 */
/**
 * @slot buttonContent - Slot for the content of the button
 */
@Component({
  tag: 'maz-btn',
  styleUrls: ['maz-btn.css'],
  shadow: true // Utilisation de l'encapsulation shadow DOM pour isoler le style du composant
})
export class MazBtn {
  @Prop() variant: 'button' | 'link' = 'button';
  @Prop() size: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'mini' = 'md';
  @Prop() color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger' | 'white' | 'black' | 'transparent' | 'theme' = 'primary';
  @Prop() type: 'submit' | 'reset' | 'button' = 'button';
  @Prop() rounded: boolean = false;
  @Prop() noRounded: boolean = false;
  @Prop() outline: boolean = false;
  @Prop() pastel: boolean = false;
  @Prop() block: boolean = false;
  @Prop() noUnderline: boolean = false;
  @Prop() noLeading: boolean = false;
  @Prop() loading: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() fab: boolean = false;
  @Prop() icon?: string;
  @Prop() leftIcon?: string;
  @Prop() rightIcon?: string;
  @Prop() noPadding: boolean = false;
  @Prop() noElevation: boolean = false;
  @Prop() contentClass?: string;
  @State() hasLoader: boolean = false;

  private handleClick() {
    // Gérer le clic sur le bouton
  }

  render() {
    const component = this.variant === 'link' ? 'a' : 'button';
    const btnColorClass = this.pastel
      ? `--${this.color}-pastel`
      : this.outline
      ? `--${this.color}-outline`
      : `--${this.color}`;
    const isDisabled = (this.loading || this.disabled) && component === 'button';
    const cursorClass = isDisabled ? '--cursor-default' : '--cursor-pointer';
    const variantClass = `--is-${this.variant}`;
    const hasLeftIcon = !!this.leftIcon || !!this.icon;
    const hasRightIcon = !!this.rightIcon;
    const hasIcon = hasLeftIcon || hasRightIcon;
    const hasFabIcon = this.fab && (this.icon);

    return (
      <Host>
        <button
          // type={this.type}
          class={`m-btn --is-button ${this.size} ${btnColorClass} ${cursorClass} ${variantClass} ${
            this.block ? '--block' : ''
          } ${this.noUnderline ? '--no-underline' : ''} ${this.noLeading ? '--no-leading' : ''} ${
            hasIcon ? '--icon' : ''
          } ${this.rounded ? '--rounded' : ''} ${this.noRounded ? '--no-rounded' : ''} ${
            this.noPadding ? '--no-padding' : ''
          } ${this.noElevation ? '--no-elevation' : ''} ${this.disabled ? '--disabled' : ''} ${
            this.loading ? '--loading' : ''
          }`}
          disabled={isDisabled}
          onClick={this.handleClick}
        >
            {hasLeftIcon && (
              <div class="m-btn__icon-left">
              </div>
            )}
            {hasFabIcon && (
              <div class="m-btn__icon">
              </div>
            )}
            <span class={`${this.hasLoader ? 'maz-invisible' : ''} ${this.contentClass}`}>
              <slot>
                default content
              </slot>
            </span>
            {hasRightIcon && (
              <div class="m-btn__icon-right">
              </div>
            )}
            {/* {this.hasLoader && <MazSpinner class="m-btn-loader" size="2em" color={this.color} />} */}
        </button>
      </Host>
    );
  }
}