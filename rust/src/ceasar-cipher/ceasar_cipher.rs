pub fn caesar(plain_text: &str, shift: u8) -> String {
    plain_text.chars()
          .map(|c| {
              if c.is_ascii_alphabet() {
                  if c.is_ascii_lowercase() { b'a' } else { b'A' };
                  
                  (first + (c as u8 + shift - first) % 26) as char
              } else {
                  c
              }
          })
          .collect()
}
