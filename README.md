# Super Journal

Super Journal is a command line app that allows you to read and write on a
plain text journal in a very easy way.

I love plain text because it means **you** are in absolute control of your
data. You will never have to pay monthly to read your journal, you will never
be locked out of your journal by me or any other company.

# How to Install

Super Journal is distributed through NPM, so if you have NodeJS and NPM
installed, you can install Super Journal with the command below:

`npm install -g super_journal`

The `-g` part is important because it installs it as a global binary in your
system. This way, the `jnl` command is available everywhere.

# How to Configure

There are not many options to change in Super Journal, but it is important that
you do a very basic configuration to make things work the way you want.

Super Journal is customized by placing a `config.json` file inside
`~/.config/super_journal/` folder. These are the configuration values with its
defaults:

```
{
    "directory": "~/journals",
    "journals": [
        "main"
    ],
    "extension": "md"
}
```

**directory**: is where in your computer the journals will be saved.

**journals**: is an array of journal names. You can have multiple journals (you
might want a separate work journal, for example). The FIRST journal in the list
is your **default** journal.

**extension**: Is what extensions the journal files will have. The default is
`md`, for markdown.

# How to Use

Super Journal installs the `jnl` command in your computer. There are **three**
basic commands to jnl, each one with many arguments you can pass.

1) `jnl write` --> Write a new entry to one of your journals.
2) `jnl read` --> It prints journal content in your terminal.
3) `jnl edit` --> It opens the entire journal in your text editor.

## Writing your journals

`jnl write`

The write command will open your default text editor (defined by the $EDITOR
env variable) to edit an entry in your default journal, that will be dated with
the current date and time. But you can pass it many arguments to customize the
behavior.

These are all the arguments you can use with the `jnl write` command, and you
can mix and match them:

### Write to a specific journal

`jnl write -j [journal]`

`jnl write --journal [journal]`

If you have multiple journals, the app will write, by default, to the first
journal defined in your config. If you want to write to a different one, you
have to use the --journal argument, with the filename of the journal you want.

You can only use journals that were defined in your config file. This is to
prevent a typo from creating a new journal file. For example, if you have a
*work* journal and you write `-j wrok`, Super Journal will refuse to obey, to
avoid creating a wrok.md file with a single entry.

Example:

`jnl write -j work`

### Use a different date or time

`jnl write -d [datetime]`

`jnl write --date [datetime]`

By default, Super Journal will use the current date and time to write an entry.
You can change that by using the `--date` argument.

It expects a string in the format `YYYY-MM-DD hh:mm:ss` or `YYYY-MM-DD`. If you
don't pass the time, it will be saved as `00:00:00`.

**But there is a secret for the date!** Instead of writing the entire year,
month and day, you can *use a special string*. You can say `today`,
`yesterday`, or the name of a day of the week like `monday` or `saturday`.

If you're using the date AND time, you have to put inside quotes (because
terminals doesn't accept spaces in arguments).

Examples:

`jnl write -d 2018-09-10`

The entry will be dated as September 10th, 2018.

`jnl write -d "2018-02-05 13:40:00"`

The entry will be dated February 5th, 2018, with the time of `13:40:00`.

`jnl write -d "yesterday 22:30"`

An entry dated yesterday at 22:30.

`jnl write -d sunday`

An entry dated as of last sunday at `00:00`.

### Write the content directly in the command line

`jnl write -c [content]`

`jnl write --content [content]`

When you just want to write something quickly, you can use the `--content`
parameter to not even open the editor. Just remember to put it inside quotes.

If you can even pair it with the `--date` parameter to quickly archive
something that happened in the past. Very useful with shell scripts.

Examples:

`jnl write --content "This entry will be saved without opening the editor"`

`jnl write -d yesterday -c "This will to, and will be dated as of yesterday"`

---

## Reading your journals

`jnl read`

The read command in its basic version will print the last 10 entries of your
default journal. But you can pass it various arguments to change the behavior
of the command.

These are all the arguments you can use with the `jnl read` command:

### Number

`jnl read -n [number]`

`jnl read --number [number]`

You can give it any number you want, and it will print the amount of journal
entries that you requestes.

Example:

`jnl read -n 5`: Will show the latest 5 entries.

### Tags

`jnl read -t [tags]`

`jnl read --tag [tags]`

Will only return entries that have the tags you passed. You can pass a list of
tags separated by commas, but there can be **no space between them**. Tags MUST
begin with `@` or it won't work.

Examples:

`jnl read -t @home`

Will print only entries tagged @home.

`jnl read -t @home,@family`

Will print only entries that are tagged with both @home AND @family.

### Journal

`jnl read -j [journal]`

`jnl read --journal [journal]`

You can tell the READ command which journal(s) to read from. You can list more
than one journal, separated by commas, like you do with tags. You can also
write `all` instead of name of journals, to read from ALL the journals in your
config file.

Examples:

`jnl read -j work`

Will read from your work journal, instead of the default one.

`jnl read -j home,work`

Will read from your home and work journal. 

`jnl read -j all`

Will read entries from ALL of your journals. That is very useful to read your
latest entries in general.

### Dates

You can also filter for entries after a certain date, of before a date. Just
remember that if you want to see many entries you have to also pass the `-n`
(number) argument or it will be limited to 10 entries.

`jnl read -f [date] -u [date]`

`jnl read --from [date] --until [date]`

Dates must be in the `YYYY-MM-DD hh:mm:ss` or `YYYY-MM-DD` formats. Example:
`2018-02-01 12:00:00` means *February 1st, 2018 at noon*.

You don't have to use both dates. You can use just `from` or `until`, if that's
what you want.

Examples:

`jnl read -from 2018-09-01`

Will filter entries starting from September 1st, 2018.

`jnl read -f 2018-10-10 -u 2018-10-13`

Will only show entries between September 10th and September 13th of the year
2018.

If you combine it with something like `-j all` to read from all journals, that
becomes a very useful tool to remember a slice of your life in all the contexts
you write about.

---

## Edit an entire journal in a text editor

`jnl edit`

This command opens your entire journal in your default text editor (defined by
the $EDITOR environment variable). You can then edit whatever you want and save
it.

By default it will open the first journal defined in your config file.

### Edit a specific journal

`jnl edit --journal [journal]`

`jnl edit -j [journal]`

You can also pass it the `--journal` parameter to decide which journal you want
to edit.

---

# Author

This was created by Leonardo Bighi.

You can find me on [twitter](https://www.twitter.com/bighi).
