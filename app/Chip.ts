export class Chip {
    private svgPath: string;
    private value: number;

    constructor(value: number) {
        this.value = value;
        this.svgPath = '../assets/chips/' + this.value + 'C.svg'
    }

    getValue(): number {
        return this.value;
    }

    getSvgPath(): string {
        return this.svgPath;
    }
}