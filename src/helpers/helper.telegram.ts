class HelperTelegram {

    public content: string;

    public getContent(): string {
        return this.content;
    }

    public setTitle(title: string) {
        this.content += `<b>${title}</b>`;
        return this;
    }

    public setMentioneds(mentioneds: string[]) {
        mentioneds.forEach((mentioned) => {
            this.content += `@${mentioned} `
        })
        this.content += '\n';
        return this;
    }

    public setAuthor(author: string) {
        this.content += `<b>NODE: ${author}</b>`;
        this.content += '\n';
        return this;
    }

    public setDescription(description: string): HelperTelegram {
        this.content += `${description}`;
        return this;
    }

    public setField(name: string, desc: string): HelperTelegram {
        this.content += `<b>${name}</b> : <b>${desc}</b>`;
        return this;
    }

    public resetContent() {
        this.content = '';
        return this;
    }
}

export default new HelperTelegram();