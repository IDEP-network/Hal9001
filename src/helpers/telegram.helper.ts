class TelegramHelper {

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

    public setDescription(description: string): TelegramHelper {
        this.content += `<pre>${description}</pre>`;
        return this;
    }

    public setField(name: string, desc: string): TelegramHelper {
        this.content += `<b>${name}</b> : <pre>${desc}</pre>`;
        return this;
    }

    public resetContent(): TelegramHelper {
        this.content = '';
        return this;
    }
}

export default new TelegramHelper();